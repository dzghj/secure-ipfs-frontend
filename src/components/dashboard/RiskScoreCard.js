export default function RiskScoreCard({ score }) {
  return (
    <div className="bg-blue-800 p-6 rounded-xl text-center">
      <h3>Security Score</h3>
      <div className="text-4xl mt-2">{score}</div>
    </div>
  );
}