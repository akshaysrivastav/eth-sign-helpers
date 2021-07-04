pragma solidity 0.5.12;

contract EthSign {
    function encode(
        address signer,
        bytes32 originalMess,
        bytes32 messageHash,
        bytes32 r,
        bytes32 s,
        uint8 v
    ) public pure returns (bytes memory) {
        return abi.encode(signer, originalMess, messageHash, r, s, v);
    }

    function decode(bytes memory _message)
        public
        pure
        returns (
            address,
            bytes32,
            bytes32,
            bytes32,
            bytes32,
            uint8
        )
    {
        return abi.decode(bytes(_message), (address, bytes32, bytes32, bytes32, bytes32, uint8));
    }

    function verify(
        address signer,
        bytes32 mess,
        bytes32 r,
        bytes32 s,
        uint8 v
    ) public pure returns (bool) {
        return signer == ecrecover(mess, v, r, s);
    }

    function test(bytes memory message)
        public
        pure
        returns (
            address,
            bytes32,
            bytes32,
            bytes32,
            bytes32,
            uint8,
            bool
        )
    {
        //decode message
        (address oper, bytes32 _originMes, bytes32 _messageHash, bytes32 r, bytes32 s, uint8 v) = decode(message);

        //verify message
        bool _isVerify = verify(oper, _messageHash, r, s, v);
        require(_isVerify == true, "signature is not correct");

        return (oper, _originMes, _messageHash, r, s, v, _isVerify);
    }

    function getSigner(
        bytes32 mess,
        bytes32 r,
        bytes32 s,
        uint8 v
    ) public pure returns (address) {
        return ecrecover(mess, v, r, s);
    }
}
