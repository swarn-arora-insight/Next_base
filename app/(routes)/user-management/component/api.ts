import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/services/apirequest";
import { toast } from "sonner";

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
  roleId: string;
  organizationId: string;
  org: string;
}

export interface RoleApiResponse {
  role_id: string;
  role_name: string;
  user_count: number;
  user_names: string[];
}

interface DeleteUserPayload {
  user_id: string;
}

interface DeleteRolePayload {
  role_id: string;
}

interface EditRolePayload {
  role_id: string;
  role_name: string;
}

interface EditUserPayload {
user_id: string,
first_name: string,
last_name: string,
org_id: string,
role_id: string
}

interface AssignFeaturePayload {
  features: {
    role_id: string;
    feature_id: string;
    permission_level: number;
  }[];
}

export interface ApiFeature {
  feature_id: string;
  feature_name: string;
  permission_level: number
}

export interface ApiFeatureGroup {
  feature_grp_id: string;
  feature_grp_name: string;
  feature_list: ApiFeature[];
}

const handleApiError = (error: any) => {
  const message =
    error?.response?.data?.header?.message ||
    error?.response?.data?.message ||
    error?.message ||
    "Something went wrong!";

  toast.error(message);
};


export const useTabsList = () => {
  return useQuery({
    queryKey: ["tabsList"],
    queryFn: async () => {
      const response = await apiRequest("post", "/uam/tabslist", {});
      const resData = response.data;
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
      return resData.response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["useOrgList"] });
    },
    onError: handleApiError,
  });
};

export const useEditOrg = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: EditOrgPayload) => {
      const response = await apiRequest("post", "/uam/editorg", payload);
      const resData = response.data;
      return resData.response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["useOrgList"] });
    },
    onError: handleApiError,
  });
};

export const useDeleteOrg = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: DeleteOrgPayload) => {
      const response = await apiRequest("post", "/uam/deleteorg", payload);
      const resData = response.data;
      return resData.response;
    },
      onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["useOrgList"] });
    },
    onError: handleApiError,
  });
};

export const roleList = () => {
  return useQuery<RoleApiResponse[]>({
    queryKey: ["roleList"],
    queryFn: async () => {
      const response = await apiRequest("post", "/uam/getroles", {});
      const resData = response.data;
      return resData.response;
    },
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

export const useCreateRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateRolePayload) => {
      const response = await apiRequest("post", "/uam/createrole", payload);
       const resData = response.data;
      return resData.response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roleList"] });
    },
    onError: handleApiError,
  });
};

export const useEditRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: EditRolePayload) => {
      const response = await apiRequest("post", "/uam/editrole", payload);
       const resData = response.data;
      return resData.response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roleList"] });
    },
    onError: handleApiError,
  });
};

export const useDeleteRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: DeleteRolePayload) => {
      const response = await apiRequest("post", "/uam/deleterole", payload);
      const resData = response.data;
      return resData.response;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roleList"] });
    },
    onError: handleApiError,
  });
};

export const usersList = () => {
  return useQuery<UserApiResponse[]>({
    queryKey: ["usersList"],
    queryFn: async () => {
      const response = await apiRequest("post", "/users/getusers", {});
      const resData = response.data;
      return resData.response as UserApiResponse[];
    },
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateUserPayload) => {
      const response = await apiRequest(
        "post",
        "/users/createuser",
        payload,
      );
      const resData = response.data;
      return resData.response;
    },
     onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usersList"] });
    },
    onError: handleApiError,
  });
};

export const useEditUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: EditUserPayload) => {
      const response = await apiRequest("post", "/uam/edituser", payload);
       const resData = response.data;
      return resData.response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usersList"] });
    },
    onError: handleApiError,
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: DeleteUserPayload) => {
      const response = await apiRequest("post", "/users/deleteuser", payload);
      const resData = response.data;
      return resData.response;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usersList"] });
    },
    onError: handleApiError,
  });
};

export const useFeatureList = (
  roleId: string,
  enabled: boolean,
) => {
  return useQuery<ApiFeatureGroup[]>({
    queryKey: ["featureList", roleId],
    queryFn: async () => {
      const response = await apiRequest("post", "/uam/getfeatures", {
        role_id: roleId,
      });
      return response.data.response;
    },
    enabled: enabled && !!roleId, 
    refetchOnWindowFocus: false,
    retry: 1,
  });
};


export const useAssingFeature = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: AssignFeaturePayload) => {
      const response = await apiRequest("post", "/uam/featureassign", payload);
      const resData = response.data;
      return resData.response;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roleList"] });
    },
    onError: handleApiError,
  });
};

