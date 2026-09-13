package rpg.backend.model;

import jakarta.persistence.Embeddable;
import lombok.*;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Attributes {

    private Integer intelligence;
    private Integer strength;
    private Integer agility;
    private Integer endurance;
    private Integer charisma;
}