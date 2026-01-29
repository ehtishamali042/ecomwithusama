import { useState } from "react";
import { useUpdateProfileMutation } from "@/react-query/mutations/profile";
import { useUser } from "@/hooks/useUser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function UpdateProfile() {
  const { user, updateUser } = useUser();
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const updateMutation = useUpdateProfileMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(
      { firstName, lastName },
      {
        onSuccess: () => {
          updateUser({ firstName, lastName });
        },
      },
    );
  };

  return (
    <div className="max-w-md p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Update Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">First Name</label>
          <Input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Last Name</label>
          <Input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        <Button
          type="submit"
          disabled={updateMutation.isPending}
          className="w-full"
        >
          {updateMutation.isPending ? "Updating..." : "Update Profile"}
        </Button>
      </form>
    </div>
  );
}
