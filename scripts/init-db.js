//javascript
// MongoDB initialization script

db = db.getSiblingDB('etincel');

// Create collections with validation
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['email', 'name', 'birthDate', 'gender'],
      properties: {
        email: {
          bsonType: 'string',
          pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}      {/* Secondary Stats */}
      
        }
          color="pink"
          small
        />
        }
          color="green"
          small
        />
        }
          color="red"
          small
        />
        }
          color="orange"
          small
        />
      

      {/* Charts */}
      
        
          User Growth
          
            
              
              
              
              
              
              
              
            
          
        

        
          Revenue
          
            
              
              
              
              
              
              
            
          
        
      
    
  );
}

function StatCard({ title, value, icon, color, trend, small }: any) {
  const colorClasses: any = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    pink: 'bg-pink-100 text-pink-600',
    red: 'bg-red-100 text-red-600',
    orange: 'bg-orange-100 text-orange-600',
  };

  return (
    
      
        
          {title}
          {value}
          {trend && (
            
              {trend} from last month
            
          )}
        
        
          {icon}
        
      
    
  );
}