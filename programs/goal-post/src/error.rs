use anchor_lang::prelude::*;

#[error_code]
pub enum GameError {
    #[msg("Invalid Player Pool Owner")]
    InvalidPlayerPool,
    #[msg("Invalid Admin Authority")]
    InvalidAdmin,
    #[msg("Invalid Authority Signer to Withdraw")]
    InvalidAuthority,
    #[msg("Invalid Vault Address")]
    InvalidVault,
    #[msg("Insufficient Vault Balance")]
    InsufficientVault,
}
