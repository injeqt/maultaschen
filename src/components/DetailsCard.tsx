import type { StatusViewModel } from "../types/status";
import { formatCalendarDate, formatShortDate, mealLabel } from "../utils/format";
import { getUpcomingPreview } from "../utils/statusViewModel";

type DetailsCardProps = {
  status: StatusViewModel;
};

export function DetailsCard({ status }: DetailsCardProps) {
  const upcomingPreview = getUpcomingPreview(status.upcoming);

  return (
    <section className="details-card">
      <div className="details-section">
        <p className="section-label">Heute im Plan</p>
        {status.matches.length > 0 ? (
          <ul className="match-list">
            {status.matches.map((meal) => (
              <li key={`${meal.category}-${meal.meal}`} className="match-item">
                <span className="match-category">{meal.category}</span>
                <strong>{meal.meal}</strong>
                {meal.description ? <p>{meal.description}</p> : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="empty-copy">Keine Maultaschen gefunden.</p>
        )}
      </div>

      <div className="details-section details-summary">
        <div>
          <p className="section-label">Nächste Chance</p>
          <strong className="detail-highlight">
            {status.nextDate ? formatCalendarDate(status.nextDate) : "Unbekannt"}
          </strong>
        </div>
      </div>

      {upcomingPreview.length > 0 ? (
        <div className="details-section">
          <p className="section-label">Weitere Termine</p>
          <ul className="upcoming-list">
            {upcomingPreview.map((day) => (
              <li key={day.date} className="upcoming-item">
                <span className="upcoming-date">{formatShortDate(day.date)}</span>
                <ul className="upcoming-meal-list">
                  {day.matches.map((meal) => (
                    <li
                      key={`${day.date}-${meal.category}-${meal.meal}`}
                      className="upcoming-meal-item"
                    >
                      {mealLabel(meal)}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
