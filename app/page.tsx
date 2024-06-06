import LoginButton from "@/components/signInWithGoogle";


export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-center font-inter lg:flex flex flex-col space-y-10">
        <LoginButton />
      </div>
    </main>
  );
}
