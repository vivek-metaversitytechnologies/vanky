import CasinoGameClient from "../../../components/casinoAdda/CasinoGameClient";

interface CasinoGamePageProps {
  params: Promise<{ gameCode: string }>;
}

export default async function CasinoGamePage({ params }: CasinoGamePageProps) {
  const { gameCode } = await params;
  return <CasinoGameClient gameCode={gameCode} />;
}
