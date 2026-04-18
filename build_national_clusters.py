"""
Cold Case Network - National State Aggregator

Paginates the Supabase `cases` table and produces public/data/national-clusters.json
with STATE-LEVEL aggregates. The front-end renders one bubble per state as the
default "no filters" view; selecting a state drops down to county-level markers
via the live Supabase path.

Per-state fields:
  total         # rows for that state
  unsolved      # solved == "No" among those rows
  solve_rate    # 1 - unsolved/total, rounded to 3 decimals
  cluster_count # count of county_fips in that state where
                #   county_total      >= MIN_CLUSTER_SIZE (10)  AND
                #   county_unsolved / county_total >= UNSOLVED_THRESHOLD (0.50)
                # These constants intentionally mirror MIN_CLUSTER_SIZE.default
                # and CLUSTER_UNSOLVED_THRESHOLD in src/lib/constants.ts - keep
                # them in sync if those change.

Output shape:
  {
    "total_cases":    <int>    # sum over all states of `total`
    "total_unsolved": <int>    # sum over all states of `unsolved`
    "total_clusters": <int>    # sum over all states of `cluster_count`
    "states": [ { state, total, unsolved, solve_rate, cluster_count }, ... ]
  }

Usage:
  python build_national_clusters.py
"""

import json
import sys
import time
from pathlib import Path

import requests

SUPABASE_URL = "https://vmkfdygxesdlqidiwfin.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZta2ZkeWd4ZXNkbHFpZGl3ZmluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0NjE1NDUsImV4cCI6MjA5MjAzNzU0NX0.4vPVbhHR_P8GPsYYIAACCQwuVeKlD_dkTrDvh4ReXqA"

PAGE_SIZE = 1000
MIN_CLUSTER_SIZE = 10
UNSOLVED_THRESHOLD = 0.50
OUTPUT_PATH = Path("public/data/national-clusters.json")

HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
}

API_URL = f"{SUPABASE_URL}/rest/v1/cases"


def fetch_page(offset: int, limit: int):
    params = {
        "select": "county_fips,state,solved",
        "offset": offset,
        "limit": limit,
    }
    try:
        resp = requests.get(API_URL, headers=HEADERS, params=params, timeout=60)
    except requests.RequestException as exc:
        raise RuntimeError(f"Request failed at offset {offset}: {exc}") from exc
    if resp.status_code != 200:
        raise RuntimeError(
            f"Bad response at offset {offset}: {resp.status_code} {resp.text[:200]}"
        )
    return resp.json()


def aggregate():
    print("Cold Case Network - National State Aggregator")
    print(f"Target: {SUPABASE_URL}")
    print(f"Page size: {PAGE_SIZE}")
    print(f"Cluster thresholds: size >= {MIN_CLUSTER_SIZE}, unsolved >= {UNSOLVED_THRESHOLD:.2f}\n")

    # state -> {"total", "unsolved", "counties": {county_fips -> {"total", "unsolved"}}}
    states: dict[str, dict] = {}

    offset = 0
    page_num = 0
    start = time.time()

    while True:
        page = fetch_page(offset, PAGE_SIZE)
        if not page:
            break
        page_num += 1

        for row in page:
            state = row.get("state")
            if not state:
                continue
            solved = row.get("solved")
            is_unsolved = solved == "No"

            bucket = states.get(state)
            if bucket is None:
                bucket = {"total": 0, "unsolved": 0, "counties": {}}
                states[state] = bucket
            bucket["total"] += 1
            if is_unsolved:
                bucket["unsolved"] += 1

            fips = row.get("county_fips")
            if fips:
                county = bucket["counties"].get(fips)
                if county is None:
                    county = {"total": 0, "unsolved": 0}
                    bucket["counties"][fips] = county
                county["total"] += 1
                if is_unsolved:
                    county["unsolved"] += 1

        elapsed = time.time() - start
        print(
            f"  Page {page_num:>4}: offset={offset:>7} "
            f"rows={len(page):>5} elapsed={elapsed:>5.1f}s",
            end="\r",
        )

        if len(page) < PAGE_SIZE:
            break
        offset += len(page)

    print()
    print(f"\n  Pages fetched:     {page_num}")
    print(f"  Distinct states:   {len(states):,}")

    out_states = []
    total_cases = 0
    total_unsolved = 0
    total_clusters = 0

    for name, bucket in states.items():
        total = bucket["total"]
        unsolved = bucket["unsolved"]
        solve_rate = 1 - (unsolved / total) if total else 0.0

        cluster_count = 0
        for county in bucket["counties"].values():
            if county["total"] < MIN_CLUSTER_SIZE:
                continue
            county_unsolved_rate = county["unsolved"] / county["total"]
            if county_unsolved_rate >= UNSOLVED_THRESHOLD:
                cluster_count += 1

        out_states.append(
            {
                "state": name,
                "total": total,
                "unsolved": unsolved,
                "solve_rate": round(solve_rate, 3),
                "cluster_count": cluster_count,
            }
        )
        total_cases += total
        total_unsolved += unsolved
        total_clusters += cluster_count

    out_states.sort(key=lambda s: s["total"], reverse=True)

    print(f"  Total cases:       {total_cases:,}")
    print(f"  Total unsolved:    {total_unsolved:,}")
    print(f"  Total clusters:    {total_clusters:,}")

    output = {
        "total_cases": total_cases,
        "total_unsolved": total_unsolved,
        "total_clusters": total_clusters,
        "states": out_states,
    }

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text(json.dumps(output), encoding="utf-8")
    size_kb = OUTPUT_PATH.stat().st_size / 1024
    print(f"\n  Wrote: {OUTPUT_PATH} ({size_kb:.1f} KB)")


def main():
    try:
        aggregate()
    except Exception as exc:
        print(f"\nERROR: {exc}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
