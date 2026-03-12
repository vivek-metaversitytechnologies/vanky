import MatchPage from "../page";

export default async function MatchByIdPage({
  params,
}: {
  params: Promise<{ matchid: string }>;
}) {
  const { matchid } = await params;
  return <MatchPage initialMatchId={matchid} />;
}
