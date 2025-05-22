export async function wandaSearchMaps({
  query,
  location,
  radius,
}: {
  query: string;
  location: string;
  radius?: number;
}): Promise<any> {
  const response = await fetch(
    `${process.env.WANDA_API_URL}/search?query=${encodeURIComponent(
      query
    )}&location=${encodeURIComponent(location)}${
      radius ? `&radius=${radius}` : ""
    }`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }
  return response.json();
}
