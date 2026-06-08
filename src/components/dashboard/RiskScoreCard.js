export default function RiskScoreCard({ score }) {
  return (
    <div className="bg-dark-card p-6 rounded-xl text-center border border-dark-border">
      <h3>Security Score</h3>
      <div className="text-4xl mt-2 text-primary">{score}</div>
    </div>
  );
}