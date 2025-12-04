import { ServiceOrder, Transaction } from '../../types';

export const mapOrderFromDB = (dbOrder: any): ServiceOrder => ({
    id: dbOrder.id,
    clientName: dbOrder.client_name,
    whatsapp: dbOrder.whatsapp,
    origin: dbOrder.origin,
    destination: dbOrder.destination,
    pickupDate: dbOrder.pickup_date,
    deliveryForecast: dbOrder.delivery_forecast,
    isContractSigned: dbOrder.status_flags?.isContractSigned || false,
    isPostedFretebras: dbOrder.status_flags?.isPostedFretebras || false,
    isCostsPaid: dbOrder.status_flags?.isCostsPaid || false,
    paymentStatus: dbOrder.payment_status || { deposit: false, pickup: false, delivery: false },
    progress: dbOrder.progress,
    financials: dbOrder.financials || { totalValue: 0, driverCost: 0, extras: [] },
    notes: dbOrder.notes || [],
    createdAt: dbOrder.created_at
});

export const mapOrderToDB = (order: ServiceOrder) => ({
    id: order.id,
    client_name: order.clientName,
    whatsapp: order.whatsapp,
    origin: order.origin,
    destination: order.destination,
    pickup_date: order.pickupDate,
    delivery_forecast: order.deliveryForecast,
    status_flags: {
        isContractSigned: order.isContractSigned,
        isPostedFretebras: order.isPostedFretebras,
        isCostsPaid: order.isCostsPaid
    },
    payment_status: order.paymentStatus,
    progress: order.progress,
    financials: order.financials,
    notes: order.notes,
    created_at: order.createdAt
});

export const mapTransactionFromDB = (dbTx: any): Transaction => ({
    id: dbTx.id,
    description: dbTx.description,
    amount: Number(dbTx.amount),
    type: dbTx.type,
    date: dbTx.date,
    category: dbTx.category
});

export const mapTransactionToDB = (tx: Transaction) => ({
    id: tx.id,
    description: tx.description,
    amount: tx.amount,
    type: tx.type,
    date: tx.date,
    category: tx.category
});
