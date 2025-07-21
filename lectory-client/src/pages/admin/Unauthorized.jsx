const Unauthorized = () => (
  <div className="text-center p-8 text-red-600">
    <h1 className="text-2xl font-bold">접근 권한이 없습니다.</h1>
    <p className="mt-2">관리자만 접근 가능한 페이지입니다.</p>
    <br />
{/*         <div className="text-center gap-4 mb-4"> */}
{/*             <button className="px-4 py-2 rounded bg-red-600 text-white" */}
{/*                 onClick={() => navigate(`/admin/contents`)} */}
{/*             > */}
{/*                 이전 페이지로</button> */}
{/*         </div> */}
  </div>

);

export default Unauthorized;
