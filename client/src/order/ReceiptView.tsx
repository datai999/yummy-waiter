import React, { useContext, useState } from 'react';
import { NonPho, Pho, Receipt } from '../my/my-class';
import { Box, Divider, Typography } from '@mui/material';
import { APP_CONTEXT } from '../App';
import { TotalBill } from './OrderView';
import { StyledPaper } from '../my/my-styled';
import { FaMinus } from 'react-icons/fa';
import { AiOutlinePhone } from 'react-icons/ai';
import { COMPONENT } from '../my/my-component';

const getBagName = (receipt: Receipt, bagIndex: number): string => {
    return receipt.isTogo()
        ? `Togo ${bagIndex + 1}`
        : bagIndex === 0 ? 'Dine-in' : receipt.bags.size > 2 ? `Togo ${bagIndex}` : 'Togo';
}

const getBagIndex = (receipt: Receipt, bagName: string): number => {
    if (receipt.isTogo()) {
        return parseInt(bagName.slice(-1)) - 1;
    }
    if (bagName === 'Dine-in') return 0;
    return parseInt(bagName.slice(-1));
}

export default function ReceiptView({ receipt, ...props }: { receipt: Receipt }) {
    const { MENU_CATEGORIES } = useContext(APP_CONTEXT);

    const [bag, setBag] = useState(0);

    const categoryItems = receipt.bags.get(bag)!;

    return (<Box sx={{ width: '400px' }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
            <Typography variant="h4" sx={{ mb: 2 }}>{receipt.getName()}</Typography>
            {receipt.note && <Typography variant="h6" sx={{ mt: '10px' }}>: {receipt.note}</Typography>}
        </Box>

        {Array.from(receipt.bags.entries()).map(([key, categoryItems], index) => (
            <COMPONENT.WrapCategoryButton props={{
                selectedCategory: getBagName(receipt, bag), category: getBagName(receipt, key),
                setCategory: (bagName) => setBag(getBagIndex(receipt, bagName)),
                size: 'medium', icon: <AiOutlinePhone style={{ fontSize: 25, marginLeft: 2 }} />,
            }} />
        )
        )}

        <StyledPaper sx={{
            m: 1, p: 1, border: 'solid 0.1px',
            display: 'flex', flexDirection: 'column', minWidth: '380px'

        }}>
            <Box sx={{ height: '350px', overflowY: 'scroll', }}>
                {MENU_CATEGORIES
                    .filter(category => {
                        const categoryItem = categoryItems.get(category)!;
                        return categoryItem.getPhoQty() + categoryItem.getNonPhoQty() > 0;
                    })
                    .map(category => (<Box key={category}>
                        <Divider />
                        {categoryItems.get(category)!.pho.map((trackedItem, index) =>
                            <Box key={index}>
                                {Array.from(trackedItem.items.entries())
                                    .filter(([id, item]) => (!item.void && item.actualQty > 0))
                                    .map(([id, item], index) => (
                                        <Box key={index} sx={{
                                            display: 'flex', flexDirection: 'row',
                                            alignItems: 'center', justifyContent: 'space-between'
                                        }}>
                                            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                                <FaMinus style={{ fontSize: 12, marginRight: 5 }} />
                                                <Box>
                                                    <Typography variant='h6'>
                                                        {renderPho(category, item)}
                                                    </Typography>
                                                    {renderPhoNote(item)}
                                                </Box>
                                            </Box>
                                            <Typography variant='h6'>
                                                {`${Number(item.actualQty * item.price).toFixed(2)}`}
                                            </Typography>
                                        </Box>
                                    ))}
                            </Box>)}
                        {categoryItems.get(category)!.nonPho.map((trackedItem, index) =>
                            <Box key={index}>
                                {Array.from(trackedItem.items.entries())
                                    .filter(([id, item]) => (!item.void && item.actualQty > 0))
                                    .map(([id, item], index) => (
                                        <Box key={index} sx={{
                                            display: 'flex', flexDirection: 'row',
                                            alignItems: 'center', justifyContent: 'space-between'
                                        }}>
                                            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                                <FaMinus style={{ fontSize: 12, marginRight: 5 }} />
                                                <Typography variant='h6'>
                                                    {renderNonPho(item)}
                                                </Typography>
                                            </Box>
                                            {item.price > 0 && <Typography variant='h6'>
                                                {`${Number(item.actualQty * item.price).toFixed(2)}`}
                                            </Typography>}
                                        </Box>
                                    ))}
                            </Box>)}
                    </Box>))
                }
            </Box>
        </StyledPaper>
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <Box>
                {/* server,
                cashier */}
            </Box>
            <TotalBill bigSize={true} bags={receipt.bags} discountPercent={receipt.discountPercent?.discount || 5} discountSubtract={receipt.discountSubtract?.discount} />
        </Box>
    </Box >)

}

const renderPho = (category: string, item: Pho) => {
    const qty = item.actualQty === 1 ? '' : item.actualQty + ' ';

    let code = item.meats.join(',');
    if (item.code === 'DB') code = 'DB';
    if (item.code === 'BPN') code = '0meat';
    if (item.combo) code = item.combo;

    if (category === 'BEEF') {
        if (item.combo?.startsWith('#8'))
            return `${qty} ${code.slice(4)}`;
        return `${qty} Phở (${code}) (${item.noodle})`;
    }

    const bamboo = item.referCode?.indexOf('bamboo') !== -1 ? ' măng ' : '';
    const dry = item.referCode?.indexOf('dry') !== -1 ? ' khô' : '';
    const noodle = ['BC', 'BT', 'BS', 'BTS'].includes(item.noodle)
        ? `Phở gà${dry} (${item.noodle})`
        : item.noodle + bamboo + ' gà' + dry;

    console.log(item);
    return `${qty} ${noodle} (${code})`;
}

const renderPhoNote = (pho: Pho) => {
    let refer = (pho.preferences || []).filter(pre => !['Măng', 'Khô'].includes(pre));
    if (pho.note && pho.note.trim().length > 0) refer.push(pho.note.toString());
    if (refer.length < 1) return null;
    return `${refer.join(',')}`;
}

const renderNonPho = (item: NonPho) => `${item.void ? 'Void:' : ''}${item.actualQty === 1 ? '' : item.actualQty} ${item.code}`