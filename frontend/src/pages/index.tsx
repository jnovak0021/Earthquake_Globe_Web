// import UserInterface  from '@/components/UserInterface';
// import Globe from '@/components/Globe';
import EarthQuakeFilter from '@/components/EarthqaukeFilter';


export default function index() {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-white text-center">Interactive Globe</h3>
      <div
        className="max-h-96 border rounded-md"
        style={{ width: '100%', height: '300px' }}>
        {/* <Globe /> */}
        <EarthQuakeFilter />
        <h1></h1>

        
      </div>
      {/* <UserInterface backendName="go"/> */}
    </div>
  );
}
