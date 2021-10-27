export default async function getUserSession ({req, getSession}) {
     try {
       const session = await getSession({ req });

       return { props: { session } };
     } catch (error) {
       return { props: { session: null } };
     }
}