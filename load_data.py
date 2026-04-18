"""
Cold Case Network — Data Loader v3
Filters SHR65_23.csv to 1980-2000, deduplicates by ID, loads into Supabase.

Usage:
  python load_data.py
"""

import csv
import json
import requests
import time

# ============================================================
# FILL THESE IN with your Supabase credentials
# ============================================================
SUPABASE_URL = "https://vmkfdygxesdlqidiwfin.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZta2ZkeWd4ZXNkbHFpZGl3ZmluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0NjE1NDUsImV4cCI6MjA5MjAzNzU0NX0.4vPVbhHR_P8GPsYYIAACCQwuVeKlD_dkTrDvh4ReXqA"

CSV_PATH = r"C:\Users\Jonel Richardson\Downloads\SHR65_23.csv"

BATCH_SIZE = 500

# ============================================================

HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=minimal",
}

API_URL = f"{SUPABASE_URL}/rest/v1/cases"


def parse_int_safe(val):
    try:
        return int(val)
    except (ValueError, TypeError):
        return None


def parse_age(val):
    try:
        age = int(val)
        return age if 0 <= age <= 120 else None
    except (ValueError, TypeError):
        return None


def clean_row(row):
    state = row["State"]
    if state == "Rhodes Island":
        state = "Rhode Island"

    return {
        "id": row["ID"],
        "county_fips": row["CNTYFIPS"] or None,
        "ori": row["Ori"],
        "state": state,
        "agency": row["Agency"],
        "agency_type": row["Agentype"],
        "source": row["Source"],
        "solved": row["Solved"],
        "year": int(row["Year"]),
        "month": row["Month"],
        "incident": parse_int_safe(row["Incident"]),
        "action_type": row["ActionType"],
        "homicide": row["Homicide"],
        "situation": row["Situation"],
        "vic_age": parse_age(row["VicAge"]),
        "vic_sex": row["VicSex"],
        "vic_race": row["VicRace"],
        "vic_ethnic": row["VicEthnic"],
        "off_age": parse_age(row["OffAge"]),
        "off_sex": row["OffSex"],
        "off_race": row["OffRace"],
        "off_ethnic": row["OffEthnic"],
        "weapon": row["Weapon"],
        "relationship": row["Relationship"],
        "circumstance": row["Circumstance"],
        "subcircum": row["Subcircum"] or None,
        "vic_count": parse_int_safe(row["VicCount"]),
        "off_count": parse_int_safe(row["OffCount"]),
        "file_date": row["FileDate"] or None,
        "msa": row["MSA"] or None,
    }


def insert_batch(batch, batch_num):
    try:
        resp = requests.post(API_URL, headers=HEADERS, data=json.dumps(batch))
        if resp.status_code in (200, 201):
            return True
        else:
            print(f"\n  ERROR batch {batch_num}: {resp.status_code} - {resp.text[:200]}")
            return False
    except Exception as e:
        print(f"\n  ERROR batch {batch_num}: {e}")
        return False


def main():
    print("Cold Case Network — Data Loader v3")
    print(f"Reading: {CSV_PATH}")
    print(f"Target:  {SUPABASE_URL}")
    print(f"Step 1: Reading CSV and deduplicating...\n")

    # STEP 1: Read all 1980-2000 rows and deduplicate by ID
    all_rows = {}
    total_read = 0
    total_skipped = 0
    rhode_island_fixes = 0
    duplicates_removed = 0

    with open(CSV_PATH, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            try:
                year = int(row["Year"])
            except (ValueError, TypeError):
                total_skipped += 1
                continue

            if year < 1980 or year > 2000:
                total_skipped += 1
                continue

            total_read += 1

            if row["State"] == "Rhodes Island":
                rhode_island_fixes += 1

            row_id = row["ID"]
            if row_id in all_rows:
                duplicates_removed += 1
                continue

            all_rows[row_id] = clean_row(row)

    unique_rows = list(all_rows.values())
    print(f"  Total rows in 1980-2000: {total_read:,}")
    print(f"  Duplicates removed:      {duplicates_removed:,}")
    print(f"  Unique rows to load:     {len(unique_rows):,}")
    print(f"  Rhode Island fixes:      {rhode_island_fixes}")
    print(f"\nStep 2: Loading into Supabase...\n")

    # STEP 2: Insert in batches
    batch_num = 0
    total_loaded = 0
    failed_batches = 0
    start_time = time.time()

    for i in range(0, len(unique_rows), BATCH_SIZE):
        batch = unique_rows[i : i + BATCH_SIZE]
        batch_num += 1
        success = insert_batch(batch, batch_num)
        if success:
            total_loaded += len(batch)
        else:
            failed_batches += 1
        print(f"  Loaded {total_loaded:,} / {len(unique_rows):,} records (batch {batch_num})", end="\r")

    elapsed = time.time() - start_time

    print(f"\n\n============ LOAD COMPLETE ============")
    print(f"  Records loaded:     {total_loaded:,}")
    print(f"  Failed batches:     {failed_batches}")
    print(f"  Time elapsed:       {elapsed:.1f} seconds")
    print(f"=======================================")

    # STEP 3: Verify
    print(f"\nStep 3: Verifying...\n")

    count_headers = {**HEADERS, "Prefer": "count=exact", "Range": "0-0"}

    resp = requests.get(API_URL, headers=count_headers, params={"select": "id"})
    total = resp.headers.get("content-range", "unknown")
    print(f"  Total records in table: {total}")

    params = {
        "select": "id",
        "state": "eq.Washington",
        "vic_sex": "eq.Female",
        "weapon": "eq.Strangulation - hanging",
    }
    resp = requests.get(API_URL, headers={**HEADERS, "Prefer": "count=exact", "Range": "0-0"}, params=params)
    gr_total = resp.headers.get("content-range", "unknown")
    print(f"  Green River (WA/Female/Strangulation): {gr_total}")

    params["solved"] = "eq.No"
    resp = requests.get(API_URL, headers={**HEADERS, "Prefer": "count=exact", "Range": "0-0"}, params=params)
    gr_unsolved = resp.headers.get("content-range", "unknown")
    print(f"  Green River unsolved: {gr_unsolved}")

    print(f"\nDone. Ready to build.")


if __name__ == "__main__":
    main()
