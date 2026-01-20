// dummy for example 

// import { useDispatch, useSelector } from "react-redux";
// import { useQuery } from "@tanstack/react-query";
// import { apiRequest } from "@/service/api-service";
// import { setQTypeList } from "@/redux/slice";
// import { AppDispatch, RootState } from "@/redux/store";

// export const useQtype = (studyID: string) => {
//   const { apiToken } = useSelector((state: RootState) => state);
//   const dispatch = useDispatch<AppDispatch>();
//   const { data: Qtype = [] } = useQuery({
//     queryKey: ["qType"],
//     queryFn: async () => {
//       try {
//         const res = await apiRequest("post", "questionnaire/qtype", {
//           apiToken: apiToken,
//           studyID,
//         });

//         dispatch(setQTypeList(res.response));
//         return res.response;
//       } catch (error: any) {
//         console.log(error.message);
//       }
//     },
//     enabled: !!apiToken,
//     refetchOnWindowFocus: false,
//     retry: 1,
//   });

//   return { Qtype };
// };