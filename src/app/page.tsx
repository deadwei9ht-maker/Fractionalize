import { NFTFractionalizer } from '@/components/nft-fractionalizer';
import { UserAuth } from '@/components/user-auth';

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <UserAuth />
      </div>
      <NFTFractionalizer />
    </main>
  );
}