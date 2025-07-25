# Regulatory Standards Mapping

The CapOpt Platform is designed to support compliance with key regulatory and industry standards relevant to high-risk sectors:

- **WHS (Work Health and Safety) Act & Regulations (Australia)**
- **ISO 45001 (Occupational Health & Safety Management Systems)**
- **ICMM (International Council on Mining & Metals) Critical Control Management**
- **Defence Industry Security & Safety Standards**

## Standards Integration Across Layers

```mermaid
graph TD
  A[Strategic Layer] --> B[WHS Act & ISO 45001]
  A --> C[ICMM Principles]
  A --> D[Defence Standards]
  B --> E[Value/Service Layer]
  C --> E
  D --> E
  E --> F[Architectural Layer]
  F --> G[Operational Layer]
  G --> H[Control & Risk Vertical]
  H --> B
  H --> C
  H --> D
```

**Explanation:**
- Each platform layer is mapped to relevant standards, ensuring compliance is embedded by design.
- The Control & Risk vertical ensures continuous alignment and assurance across all standards. 