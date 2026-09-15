interface kryptosApprovals {
  spender: string;
  owner: string;
  value: number;
  id: number;
}
interface approvalForAlls {
  approved: boolean;
  owner: string;
  id: number;
}
export interface AddressPermission{
    kryptosApprovals:kryptosApprovals[]
    approvalForAlls:approvalForAlls[]
}
