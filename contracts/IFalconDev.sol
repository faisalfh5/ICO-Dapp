//SPDX-License-Identifier:MIT
pragma solidity >0.5.0 <=0.9.0;

interface IFalconDevs {
    /**
     * @dev Returns a token ID owned by `owner` at a given `index` of its token list.
     * Use along with {balanceOf} to enumerate all of ``owner``'s tokens.
     */
    function Token_of_Owner_Byindex(
        address _owner,
        uint index
    ) external view returns (uint tokeIds);

    /**
     * @dev Returns the number of tokens in ``owner``'s account.
     */
    function Balanceof(address _owner) external view returns (uint balance);
}
