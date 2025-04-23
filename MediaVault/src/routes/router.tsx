import Layout from "./Layout";
import { createBrowserRouter } from 'react-router-dom';
import HomePage from "../pages/HomePage";
import ProdutosPage from "../pages/ProdutosPage";
import ContatosPage from "../pages/ContatosPage";


const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {path: "", element: <HomePage />},
            {path: "produtos", element: <ProdutosPage />},
            {path: "contatos", element: <ContatosPage />},           
        ]
    }
]);
export default router;