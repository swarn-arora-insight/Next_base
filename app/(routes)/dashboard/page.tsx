
"use client";
import { useEffect, useState } from "react";
import DataTable from "./components/data-table";
import { Spinner } from "@/components/ui/spinner";


const Dashboard = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); 

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center h-screen">
        <Spinner className="text-primary h-10 w-10" />
      </div>
    );
  }

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 mt-3 md:gap-6">
        <DataTable />
      </div>
    </div>
  );
};

export default Dashboard;
