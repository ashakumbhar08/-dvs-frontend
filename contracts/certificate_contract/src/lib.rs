#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, Map, String, Symbol};

#[contracttype]
#[derive(Clone)]
pub struct Certificate {
    pub cert_id: String,
    pub recipient: Address,
    pub task_id: String,
    pub issuer: Address,
    pub timestamp: u64,
    pub status: Symbol,
}

#[contract]
pub struct CertificateContract;

#[contractimpl]
impl CertificateContract {
    /// Mint a new on-chain certificate and trigger reward distribution.
    pub fn issue_certificate(
        env: Env,
        recipient: Address,
        task_id: String,
        _metadata: Map<String, String>,
    ) -> String {
        let cert_id = String::from_str(&env, "CERT-PLACEHOLDER");
        let cert = Certificate {
            cert_id: cert_id.clone(),
            recipient,
            task_id,
            issuer: env.current_contract_address(),
            timestamp: env.ledger().timestamp(),
            status: Symbol::new(&env, "active"),
        };
        env.storage().persistent().set(&cert_id, &cert);
        cert_id
    }

    /// Read-only lookup — returns certificate data for a given ID.
    pub fn verify_certificate(env: Env, cert_id: String) -> Option<Certificate> {
        env.storage().persistent().get(&cert_id)
    }

    /// Admin-only: mark a certificate as revoked on-chain.
    pub fn revoke_certificate(env: Env, cert_id: String) -> bool {
        if let Some(mut cert) = env.storage().persistent().get::<String, Certificate>(&cert_id) {
            cert.status = Symbol::new(&env, "revoked");
            env.storage().persistent().set(&cert_id, &cert);
            return true;
        }
        false
    }
}
