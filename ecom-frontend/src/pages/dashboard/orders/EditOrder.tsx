import { useParams } from "react-router-dom";

export default function EditOrder() {
  const { orderId } = useParams();
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Edit Order</h1>
      <div className="bg-white p-4 rounded shadow">
        <p>
          Edit form for order <span className="font-mono">{orderId}</span> will
          go here.
        </p>
      </div>
    </div>
  );
}
