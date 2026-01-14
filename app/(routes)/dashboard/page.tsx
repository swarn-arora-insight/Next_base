import DataTable from './components/data-table';

const Dashboard = () => {
  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 mt-3 md:gap-6 ">
        <DataTable/>
      </div>
    </div>
  );
};

export default Dashboard;
