import { PageHeader } from "../components/layout/PageHeader";
import { Card, CardTitle } from "../components/ui/Card";

const sections = [
  ["Que es vigilancia epidemiologica por aguas residuales", "Es el monitoreo sistematico de biomarcadores presentes en efluentes cloacales. La concentracion viral agregada permite estimar actividad infecciosa comunitaria sin depender solo de tests clinicos individuales."],
  ["Por que puede anticipar brotes", "Muchas personas eliminan material genetico viral antes de consultar o ser diagnosticadas. Por eso la senal ambiental puede crecer dias antes que los casos clinicos reportados."],
  ["Modelo 1D de concentracion viral", "dV/dt = S - kV - dV. La variable V representa carga viral, S la fuente de aporte, k el decaimiento y d la dilucion o remocion hidraulica."],
  ["Equilibrio y estabilidad", "El equilibrio es V* = S / (k+d). Si k+d es positivo, perturbaciones alrededor del equilibrio decaen y el sistema vuelve a una concentracion estacionaria."],
  ["Modelo 2D infectados-carga viral", "dI/dt = beta I(1 - I/K) - gamma I y dV/dt = alpha I - kV - dV. El primer termino modela crecimiento epidemiologico saturado; el segundo vincula infectados con senal ambiental."],
  ["Diagramas de fase", "El plano I-V permite visualizar campos vectoriales, nulclinas y equilibrios. Es util para entender trayectorias de brote y retorno a region segura."],
  ["Bifurcaciones", "El umbral beta > gamma separa regimenes: si la transmision efectiva supera la recuperacion, el equilibrio libre de brote pierde estabilidad y aparece un regimen con infectados persistentes."],
  ["Sistemas no homogeneos", "Lluvias, shocks de brote, descargas localizadas o cambios de caudal introducen terminos dependientes del tiempo. Estos eventos explican picos, diluciones o falsas caidas de senal."],
  ["Region segura y Lyapunov", "Una funcion tipo V_risk(I,V) penaliza excesos sobre umbrales seguros. Si disminuye, el sistema se aproxima a una region aceptable; si aumenta, sugiere alerta operativa."],
  ["Prediccion aplicada", "La plataforma ajusta una tendencia log-lineal sobre la carga viral historica y proyecta escenarios a 21 dias. Esto permite anticipar cruces de umbral alto o critico y comparar mitigacion contra crecimiento alto."],
  ["Calibracion desde datos", "A partir de mediciones historicas se estiman parametros como beta, gamma, alpha, k, d, S, I0 y V0. Esos parametros quedan listos para ejecutar modelos 1D y 2D con sentido empirico."],
  ["Reporte ejecutivo", "El sistema genera un reporte imprimible con resumen, ranking predictivo, recomendaciones y relacion con los temas de la materia. Puede guardarse como PDF desde el navegador."],
  ["Relacion con Modelado y Simulacion", "El proyecto integra ecuaciones diferenciales, metodos numericos, estabilidad local, bifurcaciones, sistemas no autonomos, prediccion, visualizacion de datos y validacion interpretativa aplicada."],
];

export function TheoryPage() {
  return (
    <>
      <PageHeader title="Marco teorico" description="Fundamentos cientificos y matematicos que justifican Wastewater Sentinel como aplicacion de Modelado y Simulacion." />
      <div className="grid gap-4 lg:grid-cols-2">
        {sections.map(([title, body], index) => (
          <Card key={title}>
            <div className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-md bg-sentinel-50 text-sm font-bold text-sentinel-700">{index + 1}</div>
            <CardTitle>{title}</CardTitle>
            <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
          </Card>
        ))}
      </div>
    </>
  );
}
