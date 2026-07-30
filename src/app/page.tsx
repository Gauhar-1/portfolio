import dbConnect from '@/lib/mongodb';
import Persona from '@/models/Persona';
import IntentGatewayClient from '@/components/intent-gateway';

export const revalidate = 60;

export const metadata = {
  title: 'Welcome | Portfolio',
  description: 'Gateway to the portfolio',
};

export default async function IntentGateway() {
  await dbConnect();
  
  const personas = await Persona.find({}).sort({ createdAt: 1 }).lean();
  
  const serializedPersonas = personas.map((p) => ({
    _id: p._id.toString(),
    name: p.name,
    description: p.description,
    theme: p.theme || 'slate',
    sectionOrder: p.sectionOrder || ['projects', 'experience', 'skills'],
  }));

  return <IntentGatewayClient personas={serializedPersonas} />;
}
