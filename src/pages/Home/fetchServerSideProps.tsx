import { FetchServerSideProps } from "@/interfaces/ctx"

export const fetchServerSideProps: FetchServerSideProps = async ({ queryClient }) => {

  const fetchData = async () => {
    const response = await fetch('http://localhost:5001/api/userData');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  };
  await queryClient.prefetchQuery('userData', fetchData);
};