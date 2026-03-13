const decorations = [
  { id: 1, width: 96 },
  { id: 2, width: 76 },
  { id: 3, width: 110 },
  { id: 4, width: 84 },
  { id: 5, width: 100 },
  { id: 6, width: 80 },
  { id: 7, width: 92 },
  { id: 8, width: 146 },
  { id: 9, width: 157 },
  { id: 10, width: 130 },
];

export function BackgroundScene() {
  return (
    <div className="background-scene" aria-hidden="true">
      {decorations.map((item) => (
        <img
          key={item.id}
          className={`background-maultasche background-maultasche-${item.id}`}
          src={`${import.meta.env.BASE_URL}image.png`}
          alt=""
          style={{ width: `${item.width}px` }}
        />
      ))}
    </div>
  );
}
