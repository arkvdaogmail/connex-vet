interface Window {
  vechain: any;
  sync2: any;
  connex: any;
}

declare namespace Connex {
  namespace Vendor {
    interface CertMessage {
      purpose: string;
      payload: {
        type: string;
        content: string;
      };
    }
  }
}

interface BusinessFormData {
  entityName: string;
  domain: string;
  country: string;
  legalType: string;
  category: string;
}

