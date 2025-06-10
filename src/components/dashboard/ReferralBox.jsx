export default function ReferralBox() {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
      <h3 className="font-semibold mb-2">🎁 Refer & Earn FCT</h3>
      <p>Earn 500 FCT for every referral. Share your link:</p>
      <input
        readOnly
        value="https://fctoken.io/invite/lorenzo"
        className="w-full bg-white border rounded p-2 mt-2 font-mono text-center"
      />
    </div>
  );
}
