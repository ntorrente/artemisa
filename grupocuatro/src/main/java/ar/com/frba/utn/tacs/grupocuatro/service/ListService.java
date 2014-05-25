package ar.com.frba.utn.tacs.grupocuatro.service;

import java.util.List;
import org.springframework.stereotype.Service;
import ar.com.frba.utn.tacs.grupocuatro.domain.List_G4;

@Service
public interface ListService {

	/**
	 * 
	 * @param id_user del usuario
	 * @param list a crear
	 * @return List_G4
	 * @throws ObjectNotFoundException si no se encuentra el usuario
	 */
	public List_G4 create(String id_user, List_G4 list);
	
	/**
	 * 
	 * @param id_user
	 * @param id_list
	 * @return List_G4
	 * throws ObjectNotFoundException si no existe el usuario o la lista buscada
	 */
	public List_G4 getListByUserId(String id_user, String id_list);

	/**
	 * 
	 * @param id_user
	 * @return List<List_G4>
	 * throws ObjectNotFoundException si no existe el usuario
	 */
	public List<List_G4> getListsFromUser(String id_user);

	/**
	 * 
	 * @param id_user
	 * @param id
	 * @throws ObjectNotFoundException si no se encuentra el usuario o la lista enviados por parámetro
	 */
	public void delete(String id_user, String id);
	
	/**
	 * 
	 * @param userLists
	 * @param id
	 * @throws ObjectNotFoundException si no se encuentra el usuario o la lista enviados por parámetro
	 */
	public List_G4 getListById(List<List_G4> lists, final String id);

}