import { sql } from "../config/db.js"

export const getALlProducts = async (req, res) => {
    try {
        const products = await sql`
            SELECT *
            FROM products
            ORDER BY create_at DESC
        `;
        console.log("Fetched Products", products);
        res.status(200).json({
            success: true,
            data: products
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch products",
            error: error.message // In production, avoid sending raw error messages
        });
    }
}

export const createProduct = async (req, res) => {
    const { name, price, image } = req.body;

    if (!name || !price || !image) {
        return res.status(400).json({
            success: false,
            message: "All field are required!",
        });
    }

    try {
        const newProduct = await sql`
            INSERT INTO products (name, price, image)
            VALUES (${name}, ${price}, ${image})
            RETURNING * 
        `;
        console.log("New product added", newProduct);

        res.status(201).json({
            success: true,
            data: newProduct[0]
        });
    } catch (error) {
        console.error("Error creating products:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create products",
            error: error.message // In production, avoid sending raw error messages
        });
    }
}

export const getProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const product = await sql`
            SELECT * 
            FROM products
            WHERE id = ${id}
        `;
        res.status(200).json({
            success: true,
            data: product[0]
        });
    } catch (error) {
        console.error("Error in getProduct controller:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message // In production, avoid sending raw error messages
        });
    }
}

export const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, price, image } = req.body;

    try {
        const updatedProduct = await sql`
            UPDATE products
            SET name = ${name}, price = ${price}, image = ${image}
            WHERE id = ${id}
            RETURNING * 
        `;

        if (updatedProduct.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Product Not Found",
                error: error.message // In production, avoid sending raw error messages
            });
        }

        res.status(200).json({
            success: true,
            data: updatedProduct[0]
        });
    } catch (error) {
        console.error("Error in updateProduct controller:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message // In production, avoid sending raw error messages
        });
    }
}

export const deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedProduct = await sql`
            DELETE FROM products
            WHERE id = ${id}
            RETURNING *
        `;

        if (deletedProduct.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Product Not Found",
                error: error.message // In production, avoid sending raw error messages
            });
        }

        res.status(200).json({
            success: true,
            data: deletedProduct[0]
        });
    } catch (error) {
        console.error("Error in deleteProduct controller:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message // In production, avoid sending raw error messages
        });
    }
}