export interface ChatClient {
  ensureInitialization(): Promise<void>;
}
