import { IReview, Product } from '../models/product';
import { IGetProduct } from '../dto/response/types';
import { Category } from '../models/category';

export async function mapProductsToIGetProducts(products: Product[]): Promise<IGetProduct[]> {
    try {
        // Map each product to IGetProduct
        const productDtos: IGetProduct[] = products.map((product) => {
            const category = product.categoryId as unknown as { name: string };
            console.log("mapper: " + category.name);
            return {
                id: product._id.toString(),
                categoryName: category.name,
                name: product.name,
                image: product.images[0] || "",
                price: product.price,
                inventoryStatus: product.stock > 0 ? "In Stock" : "Out of Stock",
                rating: calculateAverageRating(product.reviews),
            };
        });

        return productDtos;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

// Helper function to calculate average rating
function calculateAverageRating(reviews: IReview[]): number {
    if (!reviews.length) return 5;
    const total = reviews.reduce((acc, review) => acc + review.rate, 0); // Assuming each review has a `rating` field
    return total / reviews.length;
}