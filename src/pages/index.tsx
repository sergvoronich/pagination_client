import Head from "next/head";
import { Inter } from "next/font/google";
import Table from "react-bootstrap/Table";
import { Alert, Container } from "react-bootstrap";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import UsersList from "@/components/UsersList";

const inter = Inter({ subsets: ["latin"] });

export type TUserItem = {
  id: number
  firstname: string
  lastname: string
  email: string
  phone: string
  updatedAt: string
}

type TGetServerSideProps = {
  statusCode: number
  users: { usersList: TUserItem[], total: number }
}

// export const getServerSideProps = (async (ctx: GetServerSidePropsContext): Promise<{ props: TGetServerSideProps }> => {
//   try {
//     const res = await fetch("http://localhost:3000/users", {method: 'GET'})
//     if (!res.ok) {
//       return {props: {statusCode: res.status, users: {usersList: [], total: 0}}}
//     }
//     return {
//       props: {statusCode: 200, users: await res.json()}
//     }
//   } catch (e) {
//     return {props: {statusCode: 500, users: {usersList: [], total: 0}}}
//   }
// }) satisfies GetServerSideProps<TGetServerSideProps>


export default function Home({ statusCode, users }: TGetServerSideProps) {
  // if (statusCode !== 200) {
  //   return <Alert variant={'danger'}>Ошибка {statusCode} при загрузке данных</Alert>
  // }

  return (
    <>
      <Head>
        <title>Тестовое задание</title>
        <meta name="description" content="Тестовое задание" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={inter.className}>
        <Container>
          <h1 className={'mb-5'}>Пользователи</h1>

          <UsersList />

        </Container>
      </main>
    </>
  );
}
