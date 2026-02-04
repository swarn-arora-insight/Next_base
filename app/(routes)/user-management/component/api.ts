import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/services/apirequest";

interface CreateOrgPayload {
  org_name: string;
}

interface EditOrgPayload {
  org_id: string;
  org_name: string;
}

interface DeleteOrgPayload {
  org_id: string;
}

interface CreateRolePayload {
  role_name: string;
}

interface CreateUserPayload {
  first_name: string;
  last_name: string;
  org_id: string;
  role_id: string;
  email_address: string;
  password: string;
}
export interface UserApiResponse {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  user_id: string;
  role: string;
  organizationId: string;
  org: string;
}

export interface RoleApiResponse {
  id: number;
  name: string;
  organization_id: number;
  user_count: number;
  user_names: string[];
}

interface DeleteUserPayload {
  user_id: string;
}

export const useTabsList = () => {
  return useQuery({
    queryKey: ["tabsList"],
    queryFn: async () => {
      const response = await apiRequest("post", "/uam/tabslist", {});
      const resData = response.data;

      if (resData?.header?.code !== 200) {
        throw new Error(
          resData?.header?.message || "Failed to fetch tabs list",
        );
      }

      return resData.response;
    },
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

export const useOrgList  = () => {
  return useQuery({
    queryKey: ["useOrgList"],
    queryFn: async () => {
      const response = await apiRequest("post", "/uam/getorgs", {});
      const resData = response.data;

      if (resData?.header?.code !== 200) {
        throw new Error(resData?.header?.message || "Failed to fetch org list");
      }

      return resData.response;
    },
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

export const useCreateOrg = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateOrgPayload) => {
      const response = await apiRequest("post", "/uam/createorg", payload);

      const resData = response.data;

      if (resData?.header?.code !== 200) {
        throw new Error(
          resData?.header?.message 
          || "Failed to create organization",
        );
      }

      return resData.response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["useOrgList"] });
    },
  });
};

export const useEditOrg = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: EditOrgPayload) => {
      const response = await apiRequest("post", "/uam/editorg", payload);

      const resData = response.data;

      if (resData?.header?.code !== 200) {
        throw new Error(
          resData?.header?.message || "Failed to edit organization",
        );
      }

      return resData.response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["useOrgList"] });
    },
  });
};

export const useDeleteOrg = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: DeleteOrgPayload) => {
      const response = await apiRequest("post", "/uam/deleteorg", payload);

      const resData = response.data;

      if (resData?.header?.code !== 200) {
        throw new Error(
          resData?.header?.message || "Failed to delete organization",
        );
      }

      return resData.response;
    },
      onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["useOrgList"] });
    },
  });
};

export const roleList = () => {
  return useQuery<RoleApiResponse[]>({
    queryKey: ["roleList"],
    queryFn: async () => {
      const response = await apiRequest("post", "/uam/getroles", {});
      const resData = response.data;

      if (resData?.header?.code !== 200) {
        throw new Error(resData?.header?.message || "Failed to fetch roles");
      }

      return resData.response;
    },
    refetchOnWindowFocus: false,
    retry: 1,
  });
};


export const useCreateRole = () => {
  return useMutation({
    mutationFn: async (payload: CreateRolePayload) => {
      const response = await apiRequest("post", "/uam/createrole", payload);

      const resData = response.data;

      if (resData?.header?.code !== 200) {
        throw new Error(resData?.header?.message || "Failed to create role");
      }

      return resData.response;
    },
  });
};

export const usersList = () => {
  return useQuery<UserApiResponse[]>({
    queryKey: ["usersList"],
    queryFn: async () => {
      const response = await apiRequest("post", "/users/getusers", {});
      const resData = response.data;

      if (resData?.header?.code !== 200) {
        throw new Error(resData?.header?.message || "Failed to fetch users");
      }

      return resData.response as UserApiResponse[];
    },
    refetchOnWindowFocus: false,
    retry: 1,
  });
};
export const useCreateUser = () => {
  return useMutation({
    mutationFn: async (payload: CreateUserPayload) => {
      const response = await apiRequest(
        "post",
        "/v1/users/createuser",
        payload,
      );

      const resData = response.data;

      if (resData?.header?.code !== 200) {
        throw new Error(resData?.header?.message || "Failed to create user");
      }

      return resData.response;
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: DeleteUserPayload) => {
      const response = await apiRequest("post", "/users/deleteuser", payload);

      const resData = response.data;

      if (resData?.header?.code !== 200) {
        throw new Error(resData?.header?.message || "Failed to delete user");
      }

      return resData.response;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usersList"] });
    },
  });
};
