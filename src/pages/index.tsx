import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Cards Against Humans</title>
        <meta name="description" content="Cards Against Humanity. Shhhh this isn't legal" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="fixed mt-12 w-full bg-opacity-0 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          <span className="text-zinc-50">Cards</span> Against Humanity 
        </h1>
      </header>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b ">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <LoginGroup />
        </div>
      </main>
    </>
  );
};

export default Home;

const LoginGroup: React.FC = () => {
  const { data: sessionData } = useSession();

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {!sessionData ? (
        <button
          className="rounded-full bg-zinc-900 px-10 py-3 font-semibold text-zinc-50 no-underline transition-colors duration-300 hover:bg-zinc-50 hover:text-zinc-900"
          onClick={() => signIn()}
        >
          {"Sign in with Discord"}
        </button>
      ) : (
        <Link
          className="rounded-full bg-zinc-900 px-10 py-3 font-semibold text-zinc-50 no-underline transition-colors duration-300 hover:bg-zinc-50 hover:text-zinc-900"
          href="/lobby"
        >
          Create Lobby
        </Link>
      )}
    </div>
  );
};
