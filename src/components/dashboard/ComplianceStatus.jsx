export default function ComplianceStatus() {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="font-semibold mb-2">🛡️ Compliance</h3>
      <p className="text-sm">KYC Status: <span className="text-green-600 font-bold">Approved ✅</span></p>
      <p className="text-sm">Reward Rate: 6% APY</p>
      <button className="mt-3 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm">Update KYC</button>
    </div>
  );
}
