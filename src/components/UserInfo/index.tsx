'use client';
import { CircularIcon, Marble } from '@worldcoin/mini-apps-ui-kit-react';
import { CheckCircleSolid } from 'iconoir-react';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { createPublicClient, http } from 'viem'
import { worldchain } from 'viem/chains';
import UserRegistryABI from '../../abi/UserRegistryABI.json'
import { MiniKit } from '@worldcoin/minikit-js';
import { Button } from '@worldcoin/mini-apps-ui-kit-react';
/**
 * Minikit is only available on client side. Thus user info needs to be rendered on client side.
 * UserInfo component displays user information including profile picture, username, and verification status.
 * It uses the Marble component from the mini-apps-ui-kit-react library to display the profile picture.
 * The component is client-side rendered.
 */
export const UserInfo = () => {
  // Fetching the user state client side
  const session = useSession();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [userInfo, setUserInfo] = useState<any>(null);

  const client = createPublicClient({
    chain: worldchain,
    transport: http('https://worldchain-mainnet.g.alchemy.com/public'),
  })

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!session?.data?.user?.username) {
        return; // Exit early if no username
      }
      const result = await client.readContract({
        address: "0xCc8934e07Ed1b214076BFAA09C7404D6c60C5A2A",
        abi: UserRegistryABI,
        functionName: 'getUser',
        args: [session?.data?.user?.username],
      });
      setUserInfo(result);
      console.log('User info:', result);
    };
    fetchUserInfo();
  }, [session?.data?.user?.username, client]);

  const onClickRegisterUser = async () => {
    console.log('Registerin user...');

    try {
      const { finalPayload } = await MiniKit.commandsAsync.sendTransaction({
        transaction: [
          {
            address: '0xCc8934e07Ed1b214076BFAA09C7404D6c60C5A2A',
            abi: UserRegistryABI,
            functionName: "registerUser",
            args: [session?.data?.user?.username, "testURL"],
          },
        ],
      });
      console.log("Transaction payload:", finalPayload);

      if (finalPayload.status === "error") {
        console.error("Error registering user:", finalPayload);
        return;
      }

      console.log("Registering successful:", finalPayload);
      //onSuccess(finalPayload.transaction_id);
      //setTransactionId(finalPayload.transaction_id);
    } catch (error) {
      console.error("Error registering user:", error);
    } finally {
      //setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-row items-center justify-start gap-4 rounded-xl w-full border-2 border-gray-200 p-4">
      <Marble src={session?.data?.user?.profilePictureUrl} className="w-14" />
      <div className="flex flex-row items-center justify-center">
        <span className="text-lg font-semibold capitalize">
          {session?.data?.user?.username}
        </span>
        <br />

        <span className="text-lg font-semibold capitalize">
          Wallet: {session?.data?.user?.walletAddress}
          UserInfo: {userInfo}
        </span>
        {session?.data?.user?.profilePictureUrl && (
          <CircularIcon size="sm" className="ml-0">
            <CheckCircleSolid className="text-blue-600" />
          </CircularIcon>
        )}
      </div>
      <Button
        onClick={onClickRegisterUser}
        //disabled={buttonState === 'pending'}
        size="lg"
        variant="primary"
        className="w-full"
      >
        Register User
      </Button>

    </div>
  );
};
