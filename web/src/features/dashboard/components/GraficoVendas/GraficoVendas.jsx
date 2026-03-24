import React from 'react';
import { TrendingUp } from 'lucide-react';
import './GraficoVendas.css';

export default function GraficoVendas({ ultimos5Dias, maiorVenda, temVendasNaSemana }) {
  return (
    <section className="dashboard-section">
      <h2 className="section-title">Vendas da Semana</h2>
      <div className={`chart-card ${!temVendasNaSemana ? "chart-empty-state" : ""}`} style={{ paddingBottom: "40px", position: "relative" }}>
        
        {!temVendasNaSemana ? (
          <>
            <TrendingUp size={22} className="chart-empty-icon" />
            <p className="chart-empty-title">Sem vendas nesta semana</p>
            <p className="chart-empty-subtitle">O gráfico será exibido quando houver movimentação.</p>
          </>
        ) : (
          <div className="simple-bar-chart" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", height: "140px", marginTop: "20px" }}>
            {ultimos5Dias.map((dia, i) => {
              const altura = maiorVenda > 0 ? (dia.total / maiorVenda) * 100 : 0;
              return (
                <div key={i} className="bar-group" style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, gap: "8px", justifyContent: "flex-end", height: "100%" }}>
                  {dia.total > 0 && (
                    <span style={{ fontSize: "10px", color: "#6b7280" }}>R${dia.total}</span>
                  )}
                  <div
                    className={`bar ${dia.isToday ? "today" : ""}`}
                    style={{
                      width: "24px",
                      backgroundColor: dia.isToday ? "var(--vf-primary)" : "var(--vf-primary-light)",
                      borderRadius: "6px 6px 0 0",
                      height: `${altura}%`,
                      minHeight: altura > 0 ? "4px" : "0",
                    }}
                  />
                </div>
              );
            })}
          </div>
        )}

        {/* Eixo X (Dias da Semana) */}
        <div className="chart-days-row" style={{ position: "absolute", bottom: "10px", left: 0, right: 0, display: "flex", justifyContent: "space-around", fontSize: "12px", color: "var(--vf-text-muted)", textTransform: "capitalize" }}>
          {ultimos5Dias.map((dia, i) => (
            <span key={i} style={dia.isToday ? { fontWeight: "bold", color: "#374151" } : {}}>
              {dia.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}