import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

type HabitPoint = {
  id: number;
  title: string;
  subtitle: string;
  highlighted: boolean;
};

const HABITS: HabitPoint[] = [
  { id: 1, title: "Habit 1", subtitle: "Edit this text", highlighted: true },
  { id: 2, title: "Habit 2", subtitle: "Edit this text", highlighted: true },
  { id: 3, title: "Habit 3", subtitle: "Edit this text", highlighted: false },
  { id: 4, title: "Habit 4", subtitle: "Edit this text", highlighted: false },
  { id: 5, title: "Habit 5", subtitle: "Edit this text", highlighted: false },
];

const TimelineGraphic: React.FC<{
  width: number;
  height: number;
  titleOpacity: number;
}> = ({ width, height, titleOpacity }) => {
  const marginLeft = width * 0.09;
  const marginRight = width * 0.16;
  const lineY = height * 0.45;
  const circleSize = Math.min(width, height) * 0.115;
  const step = (width - marginLeft - marginRight) / (HABITS.length - 1);
  const points = HABITS.map((_, index) => marginLeft + step * index);
  const labelY = lineY + circleSize * 0.72;
  const tailStart = points[points.length - 1];
  const tailDownY = lineY + circleSize * 1.45;
  const tailBackX = points[3] - circleSize * 0.45;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "#f5f5f5",
      }}
    >
      <h1
        style={{
          margin: 0,
          position: "absolute",
          top: height * 0.11,
          width: "100%",
          textAlign: "center",
          fontSize: Math.round(width * 0.054),
          letterSpacing: -0.8,
          fontWeight: 800,
          fontFamily: "Inter, Arial, sans-serif",
          color: "#0f0f0f",
          opacity: titleOpacity,
        }}
      >
        5 Habits to Upgrade as You Grow
      </h1>

      <svg
        width={width}
        height={height}
        style={{ position: "absolute", inset: 0 }}
        viewBox={`0 0 ${width} ${height}`}
      >
        <path
          d={[
            `M ${points[0]} ${lineY}`,
            `L ${tailStart + circleSize * 0.55} ${lineY}`,
            `Q ${tailStart + circleSize * 0.92} ${lineY}, ${tailStart + circleSize * 0.95} ${
              lineY + circleSize * 0.55
            }`,
            `L ${tailStart + circleSize * 0.95} ${tailDownY}`,
            `Q ${tailStart + circleSize * 0.95} ${tailDownY + circleSize * 0.3}, ${
              tailStart + circleSize * 0.55
            } ${tailDownY + circleSize * 0.3}`,
            `L ${tailBackX} ${tailDownY + circleSize * 0.3}`,
          ].join(" ")}
          fill="none"
          stroke="#111111"
          strokeWidth={Math.max(4, Math.round(width * 0.003))}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {HABITS.map((habit, index) => {
        const x = points[index];

        return (
          <div key={habit.id}>
            <div
              style={{
                position: "absolute",
                left: x - circleSize / 2,
                top: lineY - circleSize / 2,
                width: circleSize,
                height: circleSize,
                borderRadius: "50%",
                background: "#ffffff",
                border: `${Math.max(4, Math.round(width * 0.003))}px solid #111111`,
                boxSizing: "border-box",
                boxShadow: habit.highlighted
                  ? "0 0 0 7px rgba(245, 211, 85, 0.35)"
                  : "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  fontSize: Math.round(circleSize * 0.51),
                  fontWeight: 800,
                  fontFamily: "Inter, Arial, sans-serif",
                  color: "#101010",
                  marginTop: -1,
                }}
              >
                {habit.id}
              </span>
            </div>

            <div
              style={{
                position: "absolute",
                left: x - step * 0.34,
                top: labelY,
                width: step * 0.68,
                textAlign: "center",
                fontFamily: "Inter, Arial, sans-serif",
                color: "#111111",
              }}
            >
              <div
                style={{
                  fontSize: Math.round(width * 0.026),
                  fontWeight: 800,
                  lineHeight: 1.1,
                }}
              >
                {habit.title}
              </div>
              <div
                style={{
                  marginTop: 8,
                  fontSize: Math.round(width * 0.02),
                  fontWeight: habit.highlighted ? 700 : 600,
                  opacity: 0.85,
                  lineHeight: 1.2,
                }}
              >
                {habit.subtitle}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const MyComposition: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const rawRevealProgress = interpolate(frame, [15, 170], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const revealProgress = Easing.bezier(0.22, 1, 0.36, 1)(rawRevealProgress);
  const revealWidth = interpolate(revealProgress, [0, 1], [0, width]);

  const titleOpacity = interpolate(frame, [0, 30], [0.4, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const edgeOpacity = interpolate(frame, [18, 70, 170], [0.25, 0.6, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          filter: "blur(10px)",
          transform: "scale(1.015)",
        }}
      >
        <TimelineGraphic width={width} height={height} titleOpacity={titleOpacity} />
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          clipPath: `polygon(0 0, ${revealWidth}px 0, ${revealWidth}px 100%, 0 100%)`,
        }}
      >
        <TimelineGraphic width={width} height={height} titleOpacity={titleOpacity} />
      </div>

      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: revealWidth - 40,
          width: 80,
          pointerEvents: "none",
          background:
            "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.58) 50%, rgba(255,255,255,0) 100%)",
          opacity: edgeOpacity,
          mixBlendMode: "screen",
        }}
      />
    </div>
  );
};
