import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get stock movements (history)
export const getStockMovements = async (req: Request, res: Response) => {
    try {
        const { type, limit = 50 } = req.query;
        const where: any = {};
        if (type) where.type = type;

        const movements = await prisma.stockMovement.findMany({
            where,
            include: {
                product: true,
                staff: { select: { name: true } }
            },
            take: Number(limit),
            orderBy: { createdAt: 'desc' }
        });
        res.json(movements);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching stock movements', error });
    }
};

// Low stock alert
export const getLowStockProducts = async (req: Request, res: Response) => {
    try {
        const products = await prisma.product.findMany({
            where: {
                stock: { lte: 20 }
            }
        });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching low stock products', error });
    }
};

// Add stock movement (Adjustment/Purchase)
export const addStockMovement = async (req: Request, res: Response) => {
    try {
        const { productId, type, quantity, reason, notes } = req.body;
        const staffId = (req.user as any)?.userId as string;

        // Create movement record
        const movement = await prisma.stockMovement.create({
            data: {
                productId,
                type,
                quantity: Number(quantity),
                reason,
                notes,
                staffId
            }
        });

        // Update product stock
        const product = await prisma.product.findUnique({ where: { id: productId } });
        if (product) {
            let newStock = product.stock;
            if (type === 'in') {
                newStock += Number(quantity);
            } else if (type === 'out') {
                newStock -= Number(quantity);
            } else if (type === 'adjustment') {
                // Adjustment assumes replaced quantity or difference? 
                // Usually adjustment means "set to" or "diff". Let's assume input is the DIFF to apply (e.g. -5 or +5) if type adjustment.
                // Or simplified: 'in' adds, 'out' subtracts. 
                // If reason is 'adjustment', use type 'in'/'out' to indicate direction.
                // Let's rely on type.
            }

            await prisma.product.update({
                where: { id: productId },
                data: { stock: newStock }
            });
        }

        res.status(201).json(movement);
    } catch (error) {
        res.status(500).json({ message: 'Error creating stock movement', error });
    }
};
