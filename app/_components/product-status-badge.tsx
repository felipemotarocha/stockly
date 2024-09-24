import { ProductStatusDto } from "../_data-access/product/get-products";
import { Badge } from "./ui/badge";

const getStatusLabel = (status: string) => {
  if (status === "IN_STOCK") {
    return "Em estoque";
  }
  return "Fora de estoque";
};

interface ProductStatusBadgeProps {
  status: ProductStatusDto;
}

const ProductStatusBadge = ({ status }: ProductStatusBadgeProps) => {
  const label = getStatusLabel(status);
  return (
    <Badge
      variant={label === "Em estoque" ? "default" : "outline"}
      className="gap-1.5"
    >
      {label}
    </Badge>
  );
};

export default ProductStatusBadge;
