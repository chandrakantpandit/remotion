import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";

const SCENE_PADDING_X = 34;
const SCENE_PADDING_Y = 40;
const CARD_MARGIN_X = 14;
const MOLECULE_AREA_INSET_X = 24;
const MOLECULE_AREA_TOP = 120;
const MOLECULE_AREA_BOTTOM = 28;
const MOLECULE_TEXT_SAFE_GAP = 22;

type Molecule = {
	x: number;
	y: number;
	size: number;
	phase: number;
	speed: number;
};

type PanelConfig = {
	title: string;
	subtitle: string;
	color: string;
	background: string;
	amplitudeX: number;
	amplitudeY: number;
	molecules: Molecule[];
};

const centerMolecules = (molecules: Molecule[]): Molecule[] => {
	if (molecules.length === 0) {
		return molecules;
	}

	const avgX =
		molecules.reduce((sum, molecule) => {
			return sum + molecule.x;
		}, 0) / molecules.length;
	const avgY =
		molecules.reduce((sum, molecule) => {
			return sum + molecule.y;
		}, 0) / molecules.length;

	return molecules.map((molecule) => {
		return {
			...molecule,
			x: molecule.x + (0.5 - avgX),
			y: molecule.y + (0.5 - avgY),
		};
	});
};

const pullTowardCenter = (molecules: Molecule[], factor: number): Molecule[] => {
	return molecules.map((molecule) => {
		return {
			...molecule,
			x: 0.5 + (molecule.x - 0.5) * factor,
			y: 0.5 + (molecule.y - 0.5) * factor,
		};
	});
};

const makeSolidMolecules = (): Molecule[] => {
	const molecules: Molecule[] = [];
	const cols = 5;
	const rows = 4;
	for (let row = 0; row < rows; row++) {
		for (let col = 0; col < cols; col++) {
			molecules.push({
				x: 0.28 + (col / (cols - 1)) * 0.44,
				y: 0.37 + (row / (rows - 1)) * 0.26,
				size: 17,
				phase: (row + col) * 0.7,
				speed: 0.8,
			});
		}
	}
	return centerMolecules(molecules);
};

const makeLiquidMolecules = (): Molecule[] => {
	return centerMolecules(
		pullTowardCenter(
			[
				{x: 0.23, y: 0.25, size: 16, phase: 0.3, speed: 1.2},
				{x: 0.39, y: 0.22, size: 17, phase: 1.1, speed: 0.95},
				{x: 0.55, y: 0.29, size: 16, phase: 2.4, speed: 1.25},
				{x: 0.68, y: 0.24, size: 16, phase: 1.7, speed: 0.85},
				{x: 0.78, y: 0.36, size: 17, phase: 2.9, speed: 1.15},
				{x: 0.31, y: 0.43, size: 16, phase: 3.3, speed: 0.9},
				{x: 0.45, y: 0.5, size: 17, phase: 4.1, speed: 1.35},
				{x: 0.62, y: 0.47, size: 16, phase: 2.1, speed: 1.05},
				{x: 0.76, y: 0.56, size: 16, phase: 0.8, speed: 1.25},
				{x: 0.25, y: 0.62, size: 17, phase: 5.1, speed: 1.1},
				{x: 0.38, y: 0.68, size: 16, phase: 4.4, speed: 0.9},
				{x: 0.53, y: 0.66, size: 17, phase: 3.8, speed: 1.15},
				{x: 0.69, y: 0.72, size: 16, phase: 1.9, speed: 0.95},
				{x: 0.82, y: 0.68, size: 17, phase: 0.1, speed: 1.3},
				{x: 0.3, y: 0.31, size: 16, phase: 2.2, speed: 1.05},
				{x: 0.46, y: 0.34, size: 17, phase: 0.6, speed: 1.1},
				{x: 0.61, y: 0.6, size: 16, phase: 4.9, speed: 1.2},
				{x: 0.74, y: 0.44, size: 16, phase: 3.2, speed: 1.0},
				{x: 0.33, y: 0.55, size: 17, phase: 1.5, speed: 1.05},
				{x: 0.58, y: 0.76, size: 16, phase: 2.7, speed: 0.95},
			],
			0.88,
		),
	);
};

const makeGasMolecules = (): Molecule[] => {
	return centerMolecules([
		{x: 0.15, y: 0.18, size: 15, phase: 0.6, speed: 1.5},
		{x: 0.42, y: 0.14, size: 16, phase: 2.4, speed: 1.1},
		{x: 0.78, y: 0.21, size: 15, phase: 1.7, speed: 1.45},
		{x: 0.27, y: 0.41, size: 16, phase: 4.2, speed: 1.25},
		{x: 0.64, y: 0.38, size: 15, phase: 5.1, speed: 1.65},
		{x: 0.88, y: 0.5, size: 16, phase: 2.9, speed: 1.2},
		{x: 0.14, y: 0.66, size: 15, phase: 3.8, speed: 1.4},
		{x: 0.47, y: 0.71, size: 16, phase: 0.9, speed: 1.3},
		{x: 0.74, y: 0.82, size: 15, phase: 2.2, speed: 1.55},
		{x: 0.9, y: 0.72, size: 16, phase: 4.6, speed: 1.35},
		{x: 0.24, y: 0.3, size: 15, phase: 1.4, speed: 1.45},
		{x: 0.58, y: 0.2, size: 16, phase: 3.3, speed: 1.2},
		{x: 0.82, y: 0.34, size: 15, phase: 5.2, speed: 1.5},
		{x: 0.35, y: 0.52, size: 16, phase: 2.6, speed: 1.4},
		{x: 0.53, y: 0.6, size: 15, phase: 0.2, speed: 1.6},
		{x: 0.67, y: 0.48, size: 16, phase: 4.1, speed: 1.3},
		{x: 0.12, y: 0.82, size: 15, phase: 3.7, speed: 1.45},
		{x: 0.42, y: 0.85, size: 16, phase: 1.1, speed: 1.35},
		{x: 0.61, y: 0.74, size: 15, phase: 2.8, speed: 1.55},
		{x: 0.86, y: 0.62, size: 16, phase: 4.9, speed: 1.25},
	]);
};

const PANEL_CONFIGS: PanelConfig[] = [
	{
		title: "Solid",
		subtitle: "Molecules are tightly packed and vibrate in place",
		color: "#2563eb",
		background: "linear-gradient(145deg, #dbeafe 0%, #bfdbfe 45%, #a5b4fc 100%)",
		amplitudeX: 3,
		amplitudeY: 3,
		molecules: makeSolidMolecules(),
	},
	{
		title: "Liquid",
		subtitle: "Molecules are a little farther apart and slide past each other",
		color: "#0891b2",
		background: "linear-gradient(145deg, #cffafe 0%, #99f6e4 48%, #67e8f9 100%)",
		amplitudeX: 5,
		amplitudeY: 4,
		molecules: makeLiquidMolecules(),
	},
	{
		title: "Gas",
		subtitle: "Molecules are very far apart and move very freely",
		color: "#9333ea",
		background: "linear-gradient(145deg, #ede9fe 0%, #ddd6fe 46%, #c4b5fd 100%)",
		amplitudeX: 30,
		amplitudeY: 24,
		molecules: makeGasMolecules(),
	},
];

const MoleculeCircle: React.FC<{
	cx: number;
	cy: number;
	size: number;
	color: string;
	glowOpacity: number;
}> = ({cx, cy, size, color, glowOpacity}) => {
	return (
		<>
			<div
				style={{
					position: "absolute",
					left: cx - size * 1.1,
					top: cy - size * 1.1,
					width: size * 2.2,
					height: size * 2.2,
					borderRadius: "50%",
					backgroundColor: color,
					opacity: glowOpacity,
					filter: "blur(8px)",
				}}
			/>
			<div
				style={{
					position: "absolute",
					left: cx - size,
					top: cy - size,
					width: size * 2,
					height: size * 2,
					borderRadius: "50%",
					background: `radial-gradient(circle at 32% 28%, #ffffff 0%, ${color} 62%, ${color} 100%)`,
					boxShadow: "0 8px 16px rgba(15, 23, 42, 0.12)",
				}}
			/>
		</>
	);
};

const MoleculePanel: React.FC<{
	panel: PanelConfig;
	frame: number;
	moleculeAreaWidth: number;
	moleculeAreaHeight: number;
	panelIndex: number;
}> = ({panel, frame, moleculeAreaWidth, moleculeAreaHeight, panelIndex}) => {
	const motionBoost = interpolate(frame, [0, 40], [0.86, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	return (
		<div
			style={{
				flex: 1,
				borderRadius: 28,
				margin: "0 14px",
				background: panel.background,
				border: "1.5px solid rgba(255, 255, 255, 0.5)",
				boxShadow: "0 14px 34px rgba(49, 46, 129, 0.18)",
				position: "relative",
				overflow: "hidden",
			}}
		>
			<div
				style={{
					paddingTop: 26,
					textAlign: "center",
					fontFamily: "Inter, Arial, sans-serif",
				}}
			>
				<div
					style={{
						fontSize: 54,
						fontWeight: 800,
						color: "#0f172a",
						letterSpacing: -1,
					}}
				>
					{panel.title}
				</div>
				<div
					style={{
						fontSize: 23,
						fontWeight: 500,
						color: "#334155",
						marginTop: 8,
						padding: "0 24px",
						lineHeight: 1.3,
					}}
				>
					{panel.subtitle}
				</div>
			</div>

			<div
				style={{
					position: "absolute",
					left: MOLECULE_AREA_INSET_X,
					right: MOLECULE_AREA_INSET_X,
					top: MOLECULE_AREA_TOP,
					bottom: MOLECULE_AREA_BOTTOM,
				}}
			>
				{panel.molecules.map((molecule, index) => {
					const time = frame / 30;
					const baseX = molecule.x * moleculeAreaWidth;
					const baseY = molecule.y * moleculeAreaHeight;
					const waveA = Math.sin(time * 5.4 * molecule.speed + molecule.phase + panelIndex);
					const waveB = Math.cos(time * 4.9 * molecule.speed + molecule.phase * 1.2);
					const waveC = Math.sin(time * 3.2 + index * 0.8 + panelIndex * 1.1);

					const targetX =
						baseX +
						waveA * panel.amplitudeX * motionBoost +
						waveC * (panel.amplitudeX * 0.32);
					const targetY =
						baseY +
						waveB * panel.amplitudeY * motionBoost +
						Math.cos(time * 2.6 + molecule.phase) * (panel.amplitudeY * 0.24);
					const edgePadding = molecule.size * 1.1 + 3;
					const topSafeBoundary = edgePadding + MOLECULE_TEXT_SAFE_GAP;
					const cx = Math.max(
						edgePadding,
						Math.min(moleculeAreaWidth - edgePadding, targetX),
					);
					const cy = Math.max(
						topSafeBoundary,
						Math.min(moleculeAreaHeight - edgePadding, targetY),
					);

					return (
						<MoleculeCircle
							key={`${panel.title}-${index}`}
							cx={cx}
							cy={cy}
							size={molecule.size}
							color={panel.color}
							glowOpacity={panel.title === "Gas" ? 0.24 : 0.18}
						/>
					);
				})}
			</div>
		</div>
	);
};

export const MoleculeStates: React.FC = () => {
	const frame = useCurrentFrame();
	const {width, height} = useVideoConfig();
	const cardsTrackWidth = width - SCENE_PADDING_X * 2;
	const cardInnerWidth = (cardsTrackWidth - CARD_MARGIN_X * 2 * 3) / 3;
	const cardInnerHeight = height - SCENE_PADDING_Y * 2;
	const moleculeAreaWidth = cardInnerWidth - MOLECULE_AREA_INSET_X * 2;
	const moleculeAreaHeight = cardInnerHeight - MOLECULE_AREA_TOP - MOLECULE_AREA_BOTTOM;

	return (
		<AbsoluteFill
			style={{
				background:
					"linear-gradient(135deg, #3b0764 0%, #6d28d9 38%, #7c3aed 62%, #a855f7 100%)",
				padding: `${SCENE_PADDING_Y}px ${SCENE_PADDING_X}px`,
			}}
		>
			<div
				style={{
					height: "100%",
					display: "flex",
					alignItems: "stretch",
				}}
			>
				{PANEL_CONFIGS.map((panel, index) => (
					<MoleculePanel
						key={panel.title}
						panel={panel}
						frame={frame}
						moleculeAreaWidth={moleculeAreaWidth}
						moleculeAreaHeight={moleculeAreaHeight}
						panelIndex={index}
					/>
				))}
			</div>
		</AbsoluteFill>
	);
};
