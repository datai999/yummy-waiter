import {
  Box,
  BoxProps,
  Button,
  ButtonProps,
  Paper,
  styled,
} from '@mui/material';

export const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    backgroundColor: "#fff",
    borderRadius: theme.shape.borderRadius,
}));

interface StyledButtonProps extends ButtonProps {
    selected?: boolean;
}
export const CategoryButton = styled(Button, {
    shouldForwardProp: (prop) => prop !== 'selected',
})<StyledButtonProps>(({ theme, selected }) => ({
    margin: theme.spacing(0.5),
    backgroundColor: selected ? theme.palette.primary.main : "#fff",
    color: selected ? "#fff" : theme.palette.text.primary,
    "&:hover": {
        backgroundColor: selected ? theme.palette.primary.dark : "#f5f5f5",
    },
}));

interface StyledBoxProps extends BoxProps {
    selected?: boolean;
}

export const OrderItem = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'selected',
})<StyledBoxProps>(({ theme, selected }) => ({
    padding: theme.spacing(0),
    marginBottom: theme.spacing(0),
    // backgroundColor: selected ? "primary" : "#fff",
    borderRadius: theme.shape.borderRadius,
    cursor: "pointer",
    transition: "all 0.3s ease",
    border: `${selected ? `3px solid ${theme.palette.primary.main}` : null}`,
}));