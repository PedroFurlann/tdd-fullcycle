import { RefundRuleFactory } from "./refund_rule_factory";

describe("Refund Rule Factory", () => {
  it("deve retornar FullRefund quando a reserva for cancelada com mais de 7 dias de antecedência", () => {
    const daysUntilCheckIn = 8;
    const refundRule = RefundRuleFactory.getRefundRule(daysUntilCheckIn);
    expect(refundRule.constructor.name).toBe("FullRefund");
  });

  it("deve retornar PartialRefund quando a reserva for cancelada entre 1 e 7 dias de antecedência", () => {
    const daysUntilCheckIn = 5;
    const refundRule = RefundRuleFactory.getRefundRule(daysUntilCheckIn);
    expect(refundRule.constructor.name).toBe("PartialRefund");
  });

  it("deve retornar NoRefund quando a reserva for cancelada com menos de 1 dia de antecedência", () => {
    const daysUntilCheckIn = 0;
    const refundRule = RefundRuleFactory.getRefundRule(daysUntilCheckIn);
    expect(refundRule.constructor.name).toBe("NoRefund");
  });
});



