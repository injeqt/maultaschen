from __future__ import annotations

import argparse
import json
from datetime import date, datetime, timezone
from pathlib import Path
from typing import Any
import requests

API_URL = "https://sws.maxmanager.xyz/extern/"
CANTEEN_FILE = "mensa_central.json"
CANTEEN_NAME = "Mensa Central"
CANTEEN_DISPLAY_NAME = "Mensa Central (Stuttgart Mitte)"
DEFAULT_OUTPUT = Path("public") / "data" / "status.json"

HEADERS = {
    "User-Agent": "Mozilla/5.0",
    "Accept": "application/json",
    "Accept-Language": "de-DE,de",
}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Generate GitHub Pages data for today's Maultaschen status."
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=DEFAULT_OUTPUT,
        help=f"Where to write the generated JSON (default: {DEFAULT_OUTPUT})",
    )
    parser.add_argument(
        "--source-file",
        type=Path,
        help="Optional local JSON file to use instead of calling the remote API.",
    )
    parser.add_argument(
        "--today",
        type=date.fromisoformat,
        help="Override today's date for testing, format YYYY-MM-DD.",
    )
    return parser.parse_args()


def load_payload(source_file: Path | None) -> dict[str, Any]:
    if source_file is not None:
        return json.loads(source_file.read_text(encoding="utf-8"))


    response = requests.get(
        f"{API_URL}{CANTEEN_FILE}",
        headers=HEADERS,
        timeout=30,
    )
    response.raise_for_status()
    return response.json()


def is_maultaschen(meal_name: str) -> bool:
    return "maultaschen" in meal_name.casefold()


def summarize_meal(meal: dict[str, Any]) -> dict[str, str]:
    return {
        "category": str(meal.get("category", "")).strip(),
        "meal": str(meal.get("meal", "")).strip(),
        "description": str(meal.get("description", "")).strip(),
    }


def matching_meals(meals: list[dict[str, Any]]) -> list[dict[str, str]]:
    return [
        summarize_meal(meal)
        for meal in meals
        if is_maultaschen(str(meal.get("meal", "")))
    ]


def build_status(menu_by_day: dict[str, list[dict[str, Any]]], today: date) -> dict[str, Any]:
    today_key = today.isoformat()
    today_meals = menu_by_day.get(today_key, [])
    today_matches = matching_meals(today_meals)

    upcoming_maultaschen_days = []
    for menu_day, day_meals in sorted(menu_by_day.items()):
        day_matches = matching_meals(day_meals)
        if day_matches:
            upcoming_maultaschen_days.append(
                {
                    "date": menu_day,
                    "matches": day_matches,
                }
            )

    next_match = next(
        (
            day["date"]
            for day in upcoming_maultaschen_days
            if day["date"] > today_key
        ),
        None,
    )

    return {
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "canteen": CANTEEN_DISPLAY_NAME,
        "today": today_key,
        "todayHasMenu": today_key in menu_by_day,
        "hasMaultaschenToday": bool(today_matches),
        "matchingMealsToday": today_matches,
        "nextMaultaschenDate": next_match,
        "upcomingMaultaschenDays": upcoming_maultaschen_days[:5],
    }


def write_status(output_path: Path, status: dict[str, Any]) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(
        json.dumps(status, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )


def main() -> None:
    args = parse_args()
    today = args.today or date.today()
    payload = load_payload(args.source_file)
    menu_by_day = payload[CANTEEN_NAME]
    status = build_status(menu_by_day, today)

    write_status(args.output, status)

    if status["todayHasMenu"]:
        if status["hasMaultaschenToday"]:
            print(f"Maultaschen in {CANTEEN_DISPLAY_NAME} on  {today.isoformat()}")
        else:
            print(f"did not find Maultaschen in {CANTEEN_DISPLAY_NAME} on  {today.isoformat()}")
    else:
        print(f"No Menu for {CANTEEN_DISPLAY_NAME} on  {today.isoformat()}")


if __name__ == "__main__":
    main()
