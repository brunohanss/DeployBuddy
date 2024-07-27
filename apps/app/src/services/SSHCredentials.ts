import useAuth from "../hooks/useAuth";
import { encrypt } from "./Crypto";

const SUPABASE_URL = "https://vmdpxaongmlurzagvitd.supabase.co"
const SupabaseService = () => {
  const { jwtToken } = useAuth();

  const createSshCommand = async (userId: string, serverName: string, sshCommand: string) => {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/post-ssh-credentials`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`,
      },
      body: JSON.stringify({ user_id: userId, name: serverName, ssh_command: encrypt(sshCommand), status: 'active' }),
    });
    if (response.status !== 200) {
      const error = (await response?.json())?.error
      console.log(error)
        throw new Error(error ?? "Unexpected error");
    }
    
    return await response.json();
  };

  const getSshCommand = async (id: string) => {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/get-ssh-credentials?id=${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${jwtToken}`,
      },
    });
    return await response.json();
  };

  const updateSshCommand = async (id: string, userId: string, serverName: string, sshCommand: string) => {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/put-ssh-credentials`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`,
      },
      body: JSON.stringify({ id, user_id: userId, server_name: serverName, ssh_Command: sshCommand }),
    });
    return await response.json();
  };

  const deleteSshCommand = async (id: string) => {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/delete-ssh-credentials`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`,
      },
      body: JSON.stringify({ id }),
    });
    return await response.json();
  };

  return {
    createSshCommand,
    getSshCommand,
    updateSshCommand,
    deleteSshCommand,
  };
};

export default SupabaseService;